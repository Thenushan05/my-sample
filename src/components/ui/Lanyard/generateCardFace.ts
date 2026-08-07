const spideyLogoSrc = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077342/portfolio/spidey-logo-white.png";
const arcReactorLogoSrc = "https://res.cloudinary.com/dbotzlymk/image/upload/v1786077325/portfolio/arc-reactor-logo.png";

/**
 * Generates a data URL for a custom ID card face with the given name and title.
 * This is drawn on a canvas matching the card texture resolution.
 */
export async function generateCardFace(
    name: string,
    title: string,
    avatarImageSrc?: string,
    isSpiderman?: boolean,
    isIronman?: boolean
): Promise<string> {
    const W = 2048;
    const H = 2048;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    if (isIronman) {
        // Iron Man Metallic Gold & Crimson Red Background
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, '#7f1d1d'); // Crimson Red
        gradient.addColorStop(0.5, '#180e02'); // Metallic Dark Gold
        gradient.addColorStop(1, '#082f49'); // Arc Reactor Cyan/Blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Draw HUD circle lines background on card
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 4;
        const cx = W / 2;
        const cy = H * 0.33;
        for (let r = 100; r < W; r += 160) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Iron Man Metallic borders top and bottom
        ctx.fillStyle = '#f59e0b'; // Gold
        ctx.fillRect(0, 0, W, 16);
        ctx.fillStyle = '#06b6d4'; // Cyan
        ctx.fillRect(0, H - 16, W, 16);
    } else if (isSpiderman) {
        // Spidey Red & Blue Gradient Background
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, '#7f1d1d'); // Red
        gradient.addColorStop(0.5, '#450a0a');
        gradient.addColorStop(1, '#1e3a8a'); // Blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Draw Spiderweb lines background on card
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 4;
        const cx = W / 2;
        const cy = H * 0.33;
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * W, cy + Math.sin(angle) * H);
            ctx.stroke();
        }
        for (let r = 150; r < W; r += 200) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Spidey Accent border top and bottom
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, 0, W, 16);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(0, H - 16, W, 16);
    } else {
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

        // Accent border top & bottom
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(0, 0, W, 8);
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(0, H - 8, W, 8);
    }

    // Avatar placeholder circle
    const cx = W / 2;
    const avatarY = H * 0.33;
    const avatarRadius = 360;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.fillStyle = isIronman ? '#f59e0b' : isSpiderman ? '#dc2626' : '#4f46e5';
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
            ctx.drawImage(img, cx - drawW / 2, avatarY - drawH * 0.48, drawW, drawH);
            imageDrawn = true;
        } catch (e) {
            console.warn('Failed to load avatar image for card face:', e);
        }
    }
    ctx.restore();

    if (!imageDrawn) {
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
    ctx.strokeStyle = isIronman ? '#06b6d4' : isSpiderman ? '#ef4444' : '#8b5cf6';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 110px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, cx, H * 0.63);

    // Title
    ctx.fillStyle = isIronman ? '#67e8f9' : isSpiderman ? '#60a5fa' : '#a78bfa';
    ctx.font = '58px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, cx, H * 0.72);

    // Draw Hero Logo image on card if active
    if (isIronman) {
        try {
            const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = arcReactorLogoSrc;
            });
            const logoW = 140;
            const logoH = logoW * (logoImg.height / logoImg.width);
            ctx.drawImage(logoImg, cx - logoW / 2, H * 0.81, logoW, logoH);
        } catch (e) {
            console.warn('Failed to load arc reactor logo for lanyard card:', e);
        }
    } else if (isSpiderman) {
        try {
            const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = spideyLogoSrc;
            });
            const logoW = 120;
            const logoH = logoW * (logoImg.height / logoImg.width);
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.filter = 'invert(20%) sepia(90%) saturate(5000%) hue-rotate(350deg) brightness(100%) contrast(110%) drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))';
            ctx.drawImage(logoImg, cx - logoW / 2, H * 0.81, logoW, logoH);
            ctx.restore();
        } catch (e) {
            console.warn('Failed to load spidey logo for lanyard card:', e);
        }
    } else {
        // Decorative line
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(W * 0.22, H * 0.80);
        ctx.lineTo(W * 0.78, H * 0.80);
        ctx.stroke();
    }

    // Subtle bottom text
    ctx.fillStyle = isIronman ? '#06b6d4' : isSpiderman ? '#ef4444' : 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 34px "Inter", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isIronman ? 'STARK INDUSTRIES • MARK LXXXV' : isSpiderman ? 'MARVEL • SPIDEY MODE' : 'ID: #PORT-2026', cx, H * 0.92);

    return canvas.toDataURL('image/png');
}