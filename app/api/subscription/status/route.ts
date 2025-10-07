import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { getUserActiveSubscription } from "@/lib/subscription-manager";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserActiveSubscription(session.user.id);

    if (!subscription) {
      return NextResponse.json({
        success: true,
        data: {
          hasActiveSubscription: false,
          plan: "Free",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        hasActiveSubscription: true,
        subscriptionId: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        plan: subscription.plan?.name || "Free",
        planId: subscription.planId,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar status da assinatura:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

