import { Pressable } from "react-native"

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    className?: string;
}

export default function Button({ children, onPress, className }: ButtonProps) {
    return (
        <Pressable 
            className={`bg-blue-600 max-w-[324px] w-full p-4 rounded-xl justify-center flex-row items-center gap-2.5 ${className || ''}`}
            onPress={onPress}
        >
            {children}
        </Pressable>
    )
}
