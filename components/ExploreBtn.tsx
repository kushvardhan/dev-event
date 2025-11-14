'use client'

import Image from "next/image"

export default function ExploreBtn() {
    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto font-mono" onClick={()=>alert("YO")}>
            <a href="#events" >Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={21} height={21} />
            </a>
        </button>
    )
}