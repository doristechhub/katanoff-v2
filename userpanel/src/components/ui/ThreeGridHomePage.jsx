import { CustomImg } from "../dynamiComponents";
import Link from "next/link";

export default function ThreeGridHomePage({ gridItems = [], className = '' }) {

    return (
        <section className={`container mx-auto ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {gridItems.map((item, index) => (
                    <Link
                        href={item?.link || "#"}
                        key={`three-grid-${index}`}
                        className="group block"
                    >
                        <CustomImg
                            src={item?.image}
                            alt={item?.alt || item?.title}
                            className="w-full"
                        />
                        <p className="pt-4 text-sm font-semibold uppercase inline-block border-b-2 border-transparent group-hover:border-primary group-hover:text-primary transition-all duration-300">
                            {item?.title}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
