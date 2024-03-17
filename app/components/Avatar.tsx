import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";

interface AvatarProps {
    src?: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
    if (src) {
        return (
            <Image
                src={src}
                alt="Avatar"
                className="rounded-full"
                height="30"
                width="30"
            />
        );
    }
    return (
        <FaRegUserCircle size={24} />
    )
};

export default Avatar;