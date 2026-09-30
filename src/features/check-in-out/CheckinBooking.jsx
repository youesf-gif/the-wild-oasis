import styled from "styled-components";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import BookingDataBox from "../../features/bookings/BookingDataBox";
import { useEffect, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./useCheckin";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2.4rem 4rem;
`;

function CheckinBooking() {
    const [addBreakfast, setAddBreakfast] = useState(false);
    const [confirmPaid, setConfirmPaid] = useState(false);
    const { booking, isPending } = useBooking();
    const { settings, isPending: isLoadingSettings } = useSettings();

    useEffect(() => setConfirmPaid(booking?.isPaid || false), [booking]);

    const moveBack = useMoveBack();
    const { checkin, isCheckingin } = useCheckin();

    if (isPending || isLoadingSettings) return <Spinner />;

    const {
        id: bookingId,
        guests,
        totalPrice,
        numGuests,
        hasBreakfast,
        numNights,
    } = booking;

    const optionalBrakfastPrice =
        settings.breakfastPrice * numNights * numGuests;

    function handleCheckin() {
        if (!confirmPaid) return;

        if (addBreakfast) {
            checkin({
                bookingId,
                breakfast: {
                    hasBreakfast: true,
                    extrasPrice: optionalBrakfastPrice,
                    totalPrice: totalPrice + optionalBrakfastPrice,
                },
            });
        } else {
            checkin({ bookingId, breakfast: {} });
        }
    }

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Check in booking #{bookingId}</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <Box>
                <Checkbox
                    checked={addBreakfast}
                    onChange={() => {
                        setAddBreakfast((add) => !add);
                        setConfirmPaid(false);
                    }}
                    id={"breakfast"}
                >
                    Want add brakfast for{" "}
                    {formatCurrency(optionalBrakfastPrice)}?
                </Checkbox>
            </Box>

            {!hasBreakfast && (
                <Box>
                    <Checkbox
                        checked={confirmPaid}
                        onChange={() => setConfirmPaid((confim) => !confim)}
                        disabled={confirmPaid || isCheckingin}
                        id={"confirm"}
                    >
                        I confirm that {guests.fullName} has paid the total
                        amount of{" "}
                        {!addBreakfast
                            ? formatCurrency(totalPrice)
                            : `${formatCurrency(totalPrice + optionalBrakfastPrice)} (${formatCurrency(totalPrice)} + ${formatCurrency(optionalBrakfastPrice)})`}
                    </Checkbox>
                </Box>
            )}

            <ButtonGroup>
                <Button
                    onClick={handleCheckin}
                    disabled={!confirmPaid || isCheckingin}
                >
                    Check in booking #{bookingId}
                </Button>
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default CheckinBooking;
