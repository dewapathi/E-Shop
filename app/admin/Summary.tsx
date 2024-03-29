'use client'

import { Order, Product, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Heading from "../product/[productId]/Heading";
import { formatPrice } from "@/utilis/formatPrice";
import { formatNumber } from "@/utilis/formatNumber";

interface SummaryProps {
    orders: Order[] | undefined;
    products: Product[];
    users: User[] | undefined;
}

type SummaryDataType = {
    [key: string]: {
        label: string | undefined;
        digit: number;
    }
}

const Summary: React.FC<SummaryProps> = ({ orders, products, users }) => {
    const [SummaryData, setSummaryData] = useState<SummaryDataType>({
        sale: {
            label: 'TotalSale',
            digit: 0
        },
        products: {
            label: 'Total Products',
            digit: 0
        },
        orders: {
            label: 'Total Orders',
            digit: 0
        },
        paidOrders: {
            label: 'Paid Orders',
            digit: 0
        },
        unpaidOrders: {
            label: 'Unpaid Orders',
            digit: 0
        },
        users: {
            label: 'Total Users',
            digit: 0
        },
    });

    useEffect(() => {
        setSummaryData((prev) => {
            let tempData = { ...prev }

            const totalSale = orders?.reduce((acc, item) => {
                if (item.status === 'complete') {
                    return acc + item.amount
                } else return acc;
            }, 0);

            const paidOrders = orders?.filter((order) => {
                return order.status === 'complete'
            });

            const unpaidOrders = orders?.filter((order) => {
                return order.status === 'pending'
            });

            tempData.sale.digit = totalSale!;
            tempData.orders.digit = orders?.length!;
            tempData.paidOrders.digit = paidOrders?.length!;
            tempData.unpaidOrders.digit = unpaidOrders?.length!;
            tempData.products.digit = products?.length;
            tempData.users.digit = users?.length!;

            return tempData;
        });

    }, [orders, products, users]);

    const summaryKeys = Object.keys(SummaryData);

    return (
        <div className="max-w-[1150px] m-auto">
            <div>
                <Heading title="Stats" center />
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-50vh overflow-y-auto">
                {summaryKeys && summaryKeys.map((key) => {
                    return <div key={key} className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition">
                        <div className="text-xl md:text-4xl font-bold">
                            {SummaryData[key].label === 'Total Sale' ? <>{formatPrice(SummaryData[key].digit)}</> : <>{formatNumber(SummaryData[key].digit)}</>}
                        </div>
                        <div>{SummaryData[key].label}</div>
                    </div>
                })}
            </div>
        </div>
    )
};

export default Summary;