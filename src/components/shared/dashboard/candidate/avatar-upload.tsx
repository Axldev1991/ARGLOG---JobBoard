"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/canvas-utils";
import { uploadAvatar } from "@/actions/upload-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * 📸 AVATAR UPLOAD COMPONENT
 * Proporciona una interfaz tipo WhatsApp para seleccionar, recortar y subir
 * la foto de perfil del candidato.
 */
interface User {
    avatarUrl?: string | null;
    name?: string | null;
}

export function AvatarUpload({ user }: { user: User }) {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImage(reader.result as string);
                setShowModal(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!image || !croppedAreaPixels) return;

        setIsUploading(true);
        try {
            const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
            if (!croppedImageBlob) throw new Error("Could not crop image");

            const formData = new FormData();
            formData.append("avatar", croppedImageBlob, "avatar.jpg");

            const result = await uploadAvatar(formData);
            if (result.success) {
                toast.success("¡Foto de perfil actualizada!");
                setShowModal(false);
                setImage(null);
            } else {
                toast.error(result.error || "Hubo un problema al subir la imagen");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error al procesar la imagen");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="relative group">
                <div className="h-32 w-32 rounded-full ring-4 ring-primary/20 p-1 bg-background shadow-xl transition-all group-hover:ring-primary/40">
                    <Avatar className="h-full w-full border border-border shadow-inner">
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.name || "Usuario"} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2.5 rounded-full border-4 border-background hover:scale-110 transition-transform shadow-lg z-10"
                    title="Cambiar foto de perfil"
                >
                    <Camera size={20} />
                </button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-3 font-medium uppercase tracking-wider">
                Foto de Perfil
            </p>

            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* 🔳 MODAL DE RECORTE (CLIENT SIDE) */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div 
                        className="bg-card w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                            <h3 className="text-lg font-bold">Ajustar foto</h3>
                            <button onClick={() => setShowModal(false)} className="bg-background hover:bg-muted p-1.5 rounded-full border border-border transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="relative w-full aspect-square bg-muted">
                            <Cropper
                                image={image!}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-2xl py-6 font-bold border-border hover:bg-muted"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex-1 rounded-2xl py-6 font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                                >
                                    {isUploading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        <div className="flex items-center">
                                            <Check className="mr-2" size={18} strokeWidth={3} /> 
                                            Listo
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
