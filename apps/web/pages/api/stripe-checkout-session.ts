import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

import { accountPath } from '@/config/auth';
import { getBaseURL } from '@/lib/helpers';
import { stripe } from '@/lib/server/stripe-admin';
import { getOrCreateStripeCustomer } from '@/lib/server/subscriptions-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: 'not_authenticated',
      description: 'The user does not have an active session or is not authenticated',
    });
  }

  const { priceId, metadata = {} } = req.body;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const customer = await getOrCreateStripeCustomer({
      userId: user?.id || '',
      email: user?.email || '',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        metadata,
      },
      success_url: new URL(accountPath, getBaseURL()).href,
      cancel_url: getBaseURL(),
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
}
