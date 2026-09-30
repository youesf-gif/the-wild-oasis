import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import { useLogout } from "./useLogout";
import SpinnerMini from "../../ui/SpinnerMini";

function Logout() {
    const { logout, isPending } = useLogout();

    function handleLogout() {
        logout();
    }

    return (
        <ButtonIcon onClick={handleLogout} disabled={isPending}>
            {!isPending ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
        </ButtonIcon>
    );
}

export default Logout;
