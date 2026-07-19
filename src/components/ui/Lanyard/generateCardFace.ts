/**
 * Generates a data URL for a custom ID card face with the given name and title.
 * This is drawn on a canvas matching the card texture resolution.
 */
export async function generateCardFace(
    name: string,
    title: string,
    avatarImageSrc?: string
): Promise<string> {
    const W = 2048;
    const H = 2048;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(0.5, '#312e81');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    // Accent border top
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(0, 0, W, 8);

    // Accent border bottom
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(0, H - 8, W, 8);

    // Avatar placeholder circle
    const cx = W / 2;
    const avatarY = H * 0.33;
    const avatarRadius = 360;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();

    let imageDrawn = false;
    if (avatarImageSrc) {
        try {
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = avatarImageSrc;
            });
            ctx.clip();
            const aspect = img.width / img.height;
            let drawW = avatarRadius * 2 * 1.25;
            let drawH = avatarRadius * 2 * 1.25;
            if (aspect > 1) {
                drawW = drawH * aspect;
            } else {
                drawH = drawW / aspect;
            }
            // Draw slightly shifted up so the face and shoulders sit perfectly centered inside the large circle
            ctx.drawImage(img, cx - drawW / 2, avatarY - drawH * 0.48, drawW, drawH);
            imageDrawn = true;
        } catch (e) {
            console.warn('Failed to load avatar image for card face:', e);
        }
    }
    ctx.restore();

    if (!imageDrawn) {
        // Initials in avatar if no image loaded
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 200px "Inter", "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initials = name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        ctx.fillText(initials, cx, avatarY);
    }

    ctx.beginPath();
    ctx.arc(cx, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 110px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, cx, H * 0.63);

    // Title
    ctx.fillStyle = '#a78bfa';
    ctx.font = '58px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, cx, H * 0.73);

    // Decorative line
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W * 0.22, H * 0.80);
    ctx.lineTo(W * 0.78, H * 0.80);
    ctx.stroke();

    // Subtle bottom text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '30px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ID: #PORT-2026', cx, H * 0.92);

    return canvas.toDataURL('image/png');
}