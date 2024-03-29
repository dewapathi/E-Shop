'use client';

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formatPrice } from "@/utilis/formatPrice";
import Heading from "@/app/product/[productId]/Heading";
import Status from "@/app/components/Status";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

interface ManageOrdersClientProps {
    orders: ExtendedOrder[] | undefined;
}

type ExtendedOrder = Order & {
    user: User
}

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders }) => {
    const router = useRouter();

    let rows: any = [];

    if (orders) {
        rows = orders.map((order) => {
            return {
                id: order.id,
                customer: order.user.name,
                amount: formatPrice(order.amount / 100),
                paymentStatus: order.status,
                date: moment(order.createDate).fromNow(),
                deliveryStatus: order.deliveryStatus,
            }
        });
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'customer', headerName: 'Customer Name', width: 130 },
        {
            field: 'amount', headerName: 'Amount(USD)', width: 130, renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">{params.row.amount}</div>
                )
            }
        },
        {
            field: 'paymentStatus', headerName: 'Payment Status', width: 130, renderCell: (params) => {
                return (
                    <div className="">
                        {params.row.paymentStatus === 'pending' ?
                            <Status
                                text="pending"
                                icon={MdAccessTimeFilled}
                                bg="bg-slate-200"
                                color="text-slate-700"
                            /> : params.row.paymentStatus === 'complete' ? <Status
                                text="complete"
                                icon={MdDone}
                                bg="bg-green-200"
                                color="text-purple-700"
                            /> : <></>
                        }
                    </div>
                )
            }
        },
        {
            field: 'deliveryStatus', headerName: 'Delivery Status', width: 130, renderCell: (params) => {
                return (
                    <div className="">
                        {params.row.deliveryStatus === 'pending' ?
                            <Status
                                text="pending"
                                icon={MdAccessTimeFilled}
                                bg="bg-slate-200"
                                color="text-slate-700"
                            /> : params.row.deliveryStatus === 'dispactched' ? <Status
                                text="out of stock"
                                icon={MdDeliveryDining}
                                bg="bg-purple-200"
                                color="text-purple-700"
                            /> : params.row.deliveryStatus === 'delivered' ? <Status
                                text="delivered"
                                icon={MdDone}
                                bg="bg-green-200"
                                color="text-purple-700"
                            /> : <></>
                        }
                    </div>
                )
            }
        },
        {
            field: 'date', headerName: 'Date', width: 130
        },
        {
            field: 'action', headerName: 'Actions', width: 100, renderCell: (params) => {
                return (
                    <div className="flex justify-between gap-4 w-full">
                        <ActionBtn icon={MdDeliveryDining} onClick={() => { handleDispatch(params.row.id) }} />
                        <ActionBtn icon={MdDone} onClick={() => { handleDeliver(params.row.id) }} />
                        <ActionBtn icon={MdRemoveRedEye} onClick={() => { router.push(`/order/${params.row.id}`) }} />
                    </div>
                )
            }
        },
    ];

    const handleDispatch = useCallback((id: string) => {
        axios.put("/api/order", {
            id,
            deliveryStatus: 'dispactched',
        }).then((res) => {
            toast.success("Order dispatched");
            router.refresh();
        }).catch((e) => {
            toast.error("Oops! Something went wrong");
            console.log(e);
        })
    }, []);

    const handleDeliver = useCallback((id: string) => {
        axios.put("/api/order", {
            id,
            deliveryStatus: 'delivered',
        }).then((res) => {
            toast.success("Order delivered");
            router.refresh();
        }).catch((e)=> {
            toast.error("Oops! Something went wrong");
            console.log(e);
        })
    }, []);

        return (
        <div className="max-w-[1150px] m-auto text-xl">
            <div>
                <Heading title="Manage Orders" center />
            </div>
            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 9 },
                        },
                    }}
                    pageSizeOptions={[9, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    )
};

export default ManageOrdersClient;