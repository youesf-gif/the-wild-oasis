import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as delBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
    const queryClient = useQueryClient();

    const { mutate: deleteBooking, isPending: isDeletingBooking } = useMutation(
        {
            mutationFn: (bookingId) => delBookingApi(bookingId),
            onSuccess: () => {
                toast.success(`Booking successfully deleted`);

                queryClient.invalidateQueries({ queryKey: ["bookings"] });
            },

            onError: (error) => {
                console.log(error);
                toast.error("There was an error while deleting");
            },
        },
    );

    return { deleteBooking, isDeletingBooking };
}
