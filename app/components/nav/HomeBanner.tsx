import Image from "next/image";

const HomeBannner = () => {
    return (
        <div className="relative bg-gradient-to-r from-sky-500 to from-sky-700 mb-8">
            <div className="mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-evenly">
                <div className="mb-8 md:mb-0 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Summer Sale!</h1>
                    <p className="text-lg md:text-xl text-white mb-2">Enjoy discounts on seleted items</p>
                    <p className="text-2xl md:text-5xl text-yellow-400 font-bold">GET 50% OFF</p>
                </div>
                <div className="w-1/3 relative aspect-video">
                    <Image src='/banner-image.png' alt="Banner image" className="object-contain" width={500} height={400} />
                </div>
            </div>
        </div>
    )
}
export default HomeBannner;