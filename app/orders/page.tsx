import Container from "@/app/components/Container";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import getOrdersByUserId from "@/actions/getOrdersByUserId";
import OrdersClient from "./OrderClient";
import { NextResponse } from "next/server";

const Orders = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) return NextResponse.error();

    if (currentUser.role !== 'ADMIN') {
        return NextResponse.error();
    };

    const orders = await getOrdersByUserId(currentUser.id);        

    if (!orders || orders.length === 0) {
        return <NullData title="Oops! No Orders Yet...." />;
    }

    return (
        <div>
            <Container>
                <OrdersClient orders={orders} />
            </Container>
        </div>
    )
};

export default Orders;