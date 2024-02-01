import { Checkbox } from "@chakra-ui/react"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "next-i18next"

import AccountSection from "@/components/account/AccountSection"
import { Database } from "@/types/supabase"

function Newsletter() {
  const { t } = useTranslation("account")
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser()
  const { data: subscribers } = useQuery(["subscribers"], async () => {
    const { data: subscribers, error } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("user_id", user?.id)
      .order("status", { ascending: false })

    if (error) throw new Error("Failed to fetch subscribers")
    return subscribers
  })

  return (
    <AccountSection title={t("newsletter.title")}>
      <Checkbox defaultChecked>
        <strong>Rogue Scholar Digest</strong>
      </Checkbox>
      <br />
      {t("newsletter.description")}
    </AccountSection>
  )
}
export default Newsletter
