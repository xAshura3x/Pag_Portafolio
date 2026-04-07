(() => {
    const VISIBLE_COUNT = 3;
    const INTERVAL_MS = 10000;
    const ANIMATION_MS = 520;
    const RESET_DELAY_MS = 40;
    const serviciosRow = document.querySelector("#servicios .servicios-row");
    const serviciosViewport = document.querySelector("#servicios .servicios-carrusel");

    if (!serviciosRow || !serviciosViewport) return;

    const items = Array.from(serviciosRow.children);
    const originalCount = items.length;
    if (!originalCount) return;

    const totalVisible = Math.min(VISIBLE_COUNT, originalCount);
    let isAnimating = false;
    let currentStep = 0;
    const isMobileLayout = () => window.matchMedia("(max-width: 768px)").matches;
    const EDGE_SLACK_PX = 2;
    let stepX = 0;
    let stepY = 0;
    const getTrackItems = () => Array.from(serviciosRow.children);

    const getGapSize = (vertical) => {
        const styles = window.getComputedStyle(serviciosRow);
        const gapValue = vertical
            ? styles.rowGap || styles.gap || "0"
            : styles.columnGap || styles.gap || "0";
        const parsedGap = Number.parseFloat(gapValue);
        return Number.isFinite(parsedGap) ? parsedGap : 0;
    };

    const updateTrackMetrics = () => {
        const trackItems = getTrackItems();
        if (!trackItems.length) return;

        if (isMobileLayout()) {
            const gap = getGapSize(true);
            const maxCardHeight = Math.ceil(Math.max(...trackItems.map((item) => item.getBoundingClientRect().height)));
            if (!maxCardHeight) return;

            trackItems.forEach((item) => {
                item.style.height = `${maxCardHeight}px`;
            });

            stepY = maxCardHeight + gap;
            const totalHeight = (maxCardHeight * totalVisible)
                + (gap * Math.max(totalVisible - 1, 0))
                + EDGE_SLACK_PX;
            serviciosViewport.style.height = `${Math.ceil(totalHeight)}px`;
            return;
        }

        trackItems.forEach((item) => {
            item.style.height = "";
        });

        const firstItem = trackItems[0];
        const width = firstItem ? firstItem.getBoundingClientRect().width : 0;
        const gap = getGapSize(false);
        stepX = width + gap;

        const maxCardHeight = Math.max(...trackItems.map((item) => item.getBoundingClientRect().height));
        if (!maxCardHeight) return;
        serviciosViewport.style.height = `${Math.ceil(maxCardHeight + EDGE_SLACK_PX)}px`;
    };

    const setTrackPosition = (withTransition) => {
        if (!withTransition) {
            serviciosRow.style.transition = "none";
        } else {
            serviciosRow.style.transition = `transform ${ANIMATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;
        }

        if (isMobileLayout()) {
            if (!stepY) updateTrackMetrics();
            if (!stepY) return;
            serviciosRow.style.transform = `translate3d(0, ${-(currentStep * stepY)}px, 0)`;
            return;
        }

        if (!stepX) updateTrackMetrics();
        if (!stepX) return;
        serviciosRow.style.transform = `translate3d(${-(currentStep * stepX)}px, 0, 0)`;
    };

    if (originalCount > totalVisible) {
        const clones = items
            .slice(0, totalVisible)
            .map((item) => item.cloneNode(true));

        clones.forEach((clone) => {
            clone.setAttribute("aria-hidden", "true");
            serviciosRow.appendChild(clone);
        });
    }

    serviciosRow.classList.add("servicios-slider-ready");
    updateTrackMetrics();
    setTrackPosition(false);

    if (originalCount <= totalVisible) return;

    const animateStep = () => {
        if (isAnimating) return;
        isAnimating = true;

        currentStep += 1;
        setTrackPosition(true);

        window.setTimeout(() => {
            if (currentStep >= originalCount) {
                currentStep = 0;
                setTrackPosition(false);
                void serviciosRow.offsetWidth;
            }
            updateTrackMetrics();
            isAnimating = false;
        }, ANIMATION_MS + RESET_DELAY_MS);
    };

    window.setInterval(animateStep, INTERVAL_MS);

    window.addEventListener("resize", () => {
        updateTrackMetrics();
        setTrackPosition(false);
    });

    window.addEventListener("load", () => {
        updateTrackMetrics();
        setTrackPosition(false);
    });
})();
