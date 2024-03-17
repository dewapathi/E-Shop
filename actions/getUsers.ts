export default async function getUsers() {
    try {
        return prisma?.user.findMany();
    } catch (error: any) {
        throw new Error(error);
    }
}