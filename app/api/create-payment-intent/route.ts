import { getCurrentUser } from "@/actions/getCurrentUser";
import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/libs/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16"
});

// Function to calculate the total order amount
const calculateOrderAmount = (items: CartProductType[]) => {
    // Calculate the total price of all items in the cart
    const totalPrice = items.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;
        return acc + itemTotal;
    }, 0);

    const price: any = Math.floor(totalPrice);

    return price;
};

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    };

    const body = await request.json();
    const { items, payment_intent_id } = body;
    const total = calculateOrderAmount(items) * 100;
    const orderData = {
        user: { connect: { id: currentUser.id } },
        amount: total,
        currency: 'usd',
        status: "pending",
        deliveryStatus: "pending",
        paymentIntentId: payment_intent_id,
        products: items
    }

    if (payment_intent_id) {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (current_intent) {
            const update_intent = await stripe.paymentIntents.update(payment_intent_id, { amount: total });

            const [existing_order, update_order] = await Promise.all([
                prisma.order.findFirst({
                    where: { paymentIntentId: payment_intent_id }
                }),
                prisma.order.update({
                    where: { paymentIntentId: payment_intent_id },
                    data: {
                        amount: total,
                        products: items
                    }
                }),
            ]);

            if (!existing_order) {
                return NextResponse.error();
            }

            return NextResponse.json({ paymentIntent: update_intent });
        }
    } else {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        //create the order
        orderData.paymentIntentId = paymentIntent.id;

        await prisma.order.create({
            data: orderData,
        });

        return NextResponse.json({ paymentIntent });
    }

    //Return a default response
    return NextResponse.error();
};