"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/canvas-utils";
import { uploadLogo } from "@/actions/company/upload-logo";
import { Camera, Loader2, X, Check, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * 🏢 LOGO UPLOAD COMPONENT
 * Proporciona una interfaz de selección y recorte para el logo de la empresa.
 * Optimizado para formatos corporativos (rectangular/cuadrado).
 */
interface CompanyProfile {
    logo?: string | null;
    legalName?: string;
}

export function LogoUpload({ profile }: { profile: CompanyProfile | null | undefined }) {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
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
            formData.append("logo", croppedImageBlob, "logo.jpg");

            const result = await uploadLogo(formData);
            if (result.success) {
                toast.success("¡Logo corporativo actualizado!");
                setShowModal(false);
                setImage(null);
            } else {
                toast.error(result.error || "Hubo un problema al subir el logo");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error al procesar el logo de la empresa");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mb-10">
            <div className="relative group">
                <div className="h-40 w-40 rounded-3xl ring-4 ring-primary/10 p-1.5 bg-background shadow-xl transition-all group-hover:ring-primary/30 overflow-hidden">
                    <div className="h-full w-full rounded-2xl overflow-hidden bg-muted/30 flex items-center justify-center border border-border border-dashed">
                        {profile?.logo ? (
                            <img src={profile.logo} alt={profile?.legalName || "Logo"} className="h-full w-full object-contain p-2" />
                        ) : (
                            <Building2 className="text-muted-foreground/40" size={56} />
                        )}
                    </div>
                </div>
                
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-[-10px] right-[-10px] bg-primary text-primary-foreground p-3 rounded-2xl border-4 border-background hover:scale-110 transition-transform shadow-lg z-10"
                    title="Actualizar logo de empresa"
                >
                    <Camera size={22} />
                </button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-[0.2em]">
                Identidad Corporativa
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)}>
                    <div 
                        className="bg-card w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
                            <div>
                                <h3 className="text-xl font-bold">Encuadrar Logo</h3>
                                <p className="text-xs text-muted-foreground mt-1">Asegurate que el logo esté centrado</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="bg-background hover:bg-muted p-2 rounded-full border border-border transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="relative w-full aspect-square bg-[#111]">
                            <Cropper
                                image={image!}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // 1:1 es el estándar para logos en dashboards
                                cropShape="rect" // Usamos RECT porque los logos pueden tener bordes rectos
                                showGrid={true}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>Escala</span>
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

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-[1.25rem] py-8 text-lg font-bold border-border hover:bg-muted"
                                >
                                    Cerrar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex-1 rounded-[1.25rem] py-8 text-lg font-bold bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95"
                                >
                                    {isUploading ? (
                                        <Loader2 className="animate-spin h-6 w-6" />
                                    ) : (
                                        <div className="flex items-center">
                                            <Check className="mr-2" size={24} strokeWidth={3} /> 
                                            Aplicar
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
