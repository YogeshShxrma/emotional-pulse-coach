
import { useState, useRef, useEffect } from "react";
import { motion, useDragControls, PanInfo } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import SessionsContent from "./SessionsContent";

const TherapyBookingButton = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dragControls = useDragControls();
  const buttonRef = useRef<HTMLDivElement>(null);

  // Initialize position at the right side of the screen
  useEffect(() => {
    if (buttonRef.current) {
      setPosition({
        x: window.innerWidth - buttonRef.current.offsetWidth - 24,
        y: 0
      });
    }
  }, []);

  const handleDragEnd = (_event: MouseEvent, info: PanInfo) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }));
  };

  const handleBookingClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <motion.div
        ref={buttonRef}
        className="fixed z-40"
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          x: position.x,
          y: position.y
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        drag
        dragControls={dragControls}
        onDragEnd={handleDragEnd}
        dragMomentum={false}
        dragConstraints={{
          top: 0,
          left: 0,
          right: window.innerWidth - 70,
          bottom: window.innerHeight - 180
        }}
      >
        <button 
          className={cn(
            "flex flex-col items-center justify-center w-14 h-14 rounded-full",
            "bg-emotionBlue text-white shadow-lg hover:bg-emotionBlue-dark"
          )}
          onClick={handleBookingClick}
        >
          <Calendar className="w-7 h-7" />
        </button>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book a Therapy Session
            </DialogTitle>
            <DialogDescription>
              Connect with licensed professionals for personalized therapy sessions
            </DialogDescription>
          </DialogHeader>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="mt-2">
            <SessionsContent />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TherapyBookingButton;
