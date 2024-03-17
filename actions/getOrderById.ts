interface Iparams {
    orderId?: string;
};

export default async function getOrderById(params: Iparams) {
    try {
        const { orderId } = params;
        const order = prisma?.order.findUnique({
            where: {
                id: orderId,
            }
        });

        if (!order) return null;

        return order;
    } catch (e: any) {
        throw new Error(e)
    }
};

