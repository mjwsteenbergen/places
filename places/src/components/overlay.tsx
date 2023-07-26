import { PropsWithChildren } from "react"

export const Overlay = ({ children }: PropsWithChildren<{}>) => {
    return <div className="h-[100dvh] w-screen z-10 absolute top-0 left-0 flex justify-end pointer-events-none overflow-hidden">
        {children}
    </div>
}