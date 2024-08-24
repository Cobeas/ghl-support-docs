const LoaderComponent = () => {
    return (
        <>
        <div className="loader">
            <div className="liquid"></div>
            <div className="liquid"></div>
            <div className="liquid"></div>
            <div className="liquid"></div>
        </div>
        <svg>
            <filter id="gooey">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                <feColorMatrix values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -10
                    " />
            </filter>
        </svg>
        </>
    )
}

export default LoaderComponent;