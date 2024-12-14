document.addEventListener("DOMContentLoaded", function() {
    const animatedElements = document.querySelectorAll('.animate-text');
    
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });

    // Keep text visible after animation completes
    animatedElements.forEach(el => {
        el.style.animationFillMode = "forwards";
    });
});
