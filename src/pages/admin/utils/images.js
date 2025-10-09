// Returns a dataURL (resized if large) to keep localStorage small.
export async function fileToDataURL(file) {
    if (!file) return null;

    const maxBytes = 800 * 1024; // ~800KB
    const buf = await file.arrayBuffer();
    if (buf.byteLength <= maxBytes) {
        return await new Promise((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.readAsDataURL(file);
        });
    }

    const imgURL = URL.createObjectURL(file);
    const img = await new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = imgURL;
    });

    const maxW = 640;
    const scale = Math.min(1, maxW / img.width);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(imgURL);
    return canvas.toDataURL('image/jpeg', 0.8);
}
