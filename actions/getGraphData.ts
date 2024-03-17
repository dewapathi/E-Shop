import moment from "moment";

export default async function getGraphData() {
    try {
        const startDate = moment().subtract(6, "days").startOf("day");
        const endDate = moment().endOf("day");
        console.log('startDate', startDate);
        console.log('endDate', endDate);

        const result = await prisma?.order.groupBy({
            by: ["createDate"],
            where: {
                createDate: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString(),
                },
                status: "complete",
            },
            _sum: {
                amount: true,
            }
        });

        console.log('result', result);

        const aggregatedData: {
            [day: string]: { day: string; date: string; totalAmount: number };
        } = {};
        console.log('aggregatedData', aggregatedData);

        const currentDate = startDate.clone();
        console.log('currentDate', currentDate);

        while (currentDate <= endDate) {
            const day = currentDate.format("dddd");
            console.log("day<<<<", day, currentDate);

            aggregatedData[day] = {
                day,
                date: currentDate.format("YYYY-MM-DD"),
                totalAmount: 0,
            };

            currentDate.add(1, "day");
        }

        result?.forEach((entry) => {
            const day = moment(entry.createDate).format("dddd");
            const amount = entry._sum.amount || 0;
            aggregatedData[day].totalAmount += amount;
        });

        const formattedData = Object.values(aggregatedData).sort((a, b) => moment(a.date).diff(moment(b.date)));
        console.log('formattedData', formattedData);

        return formattedData;
    } catch (e: any) {
        throw new Error(e);
    }
};