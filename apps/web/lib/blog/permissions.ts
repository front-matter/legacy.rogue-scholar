import { useUserSubscriptions } from "@/lib/blog/subscriptions"

export function useUserPermissions() {
  const { currentlySubscribedPlan, loading } = useUserSubscriptions()

  /* TODO: Get permissions for subscribed plan */

  return {
    isUserSubscribed: !!currentlySubscribedPlan,
    loading,
  }
}
