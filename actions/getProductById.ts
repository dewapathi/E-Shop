interface Iparam {
    productId: string;
}

export default async function getProductById(params: Iparam) {
    try {
        const { productId } = params;

        const product = await prisma?.product.findUnique({
            where: {
                id: productId
            },
            include: {
                reviews: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        createdDate: 'desc'
                    }
                }
            }
        });

        if (!product) return null;

        return product;
    } catch (e: any) {
        throw new Error(e);
    }
};