import prisma from "@/libs/prismadb";

export interface IproductParams {
    category?: string | null;
    searchTerm?: string | null;
}

export default async function getProducts(params: IproductParams) {  
    try {     
        const { category, searchTerm } = params;
        
        let searchString = (searchTerm || '').trim();

        if (!searchString) {
            searchString = ''
        }

        let query: any = {}

        if (category) {
            query.category = category;
        }
      
        const products = await prisma?.product.findMany({
            where: {
                ...query,
                OR: [
                    {
                        name: {
                            contains: searchString,
                            mode: 'insensitive'
                        },
                        description: {
                            contains: searchString,
                            mode: 'insensitive'
                        }
                    }
                ]
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
        
        return products;
    } catch (e: any) {
        throw new Error(e);
    }
};