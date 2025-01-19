
import { useRef } from 'react';

export const useDraggable = () => {
    const modalRef = useRef(null);

    const handleMouseDown = (event) => {
        const modal = modalRef.current;
        const shiftX = event.clientX - modal.getBoundingClientRect().left;
        const shiftY = event.clientY - modal.getBoundingClientRect().top;
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea' ) return;

        const moveAt = (pageX, pageY) => {
            modal.style.left = pageX - shiftX + 'px';
            modal.style.top = pageY - shiftY + 'px';
        };

        const onMouseMove = (event) => {
            moveAt(event.pageX, event.pageY);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };

        event.preventDefault();
    };

    return { modalRef, handleMouseDown };
};
