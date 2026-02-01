// components/CreatePageModal.tsx
import { useCreatePage } from "@/hooks/usePages";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CreatePageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = [
  "#FF6B6B", // قرمز
  "#4ECDC4", // فیروزه‌ای
  "#45B7D1", // آبی
  "#96CEB4", // سبز
  "#FFEAA7", // زرد
  "#DDA15E", // قهوه‌ای
  "#BC6C25", // نارنجی تیره
  "#9B59B6", // بنفش
];

export function CreatePageModal({ open, onOpenChange }: CreatePageModalProps) {
  const [title, setTitle] = useState("");
  const [templateType, setTemplateType] = useState<"CALENDAR" | "BOARD">("BOARD");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const createPage = useCreatePage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createPage.mutateAsync({
        title: title.trim(),
        templateType,
        color: selectedColor,
      });

      // Reset form
      setTitle("");
      setTemplateType("BOARD");
      setSelectedColor(COLORS[0]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      classNames={{
        wrapper: "wrapper",
      }}
      className=""
    >
      <ModalContent className="card max-h-102">
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">ساخت صفحه جدید</h3>
            <p className="text-sm text-default-500">
              یک صفحه جدید برای مدیریت کارها و رویدادهای خود بسازید
            </p>
          </ModalHeader>

          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="عنوان صفحه"
                placeholder="مثلاً: کارهای روزانه من"
                value={title}
                onChange={() => setTitle(title)}
              />

              <Select
                label={"مدل بورد"}
                selectedKeys={[templateType]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setTemplateType(value as "CALENDAR" | "BOARD");
                }}
                className="flex justify-between"
              >
                <SelectSection className="bg-gray-200 rounded-md">
                  <SelectItem key="BOARD">بورد (Kanban)</SelectItem>
                  <SelectItem key="CALENDAR">تقویم</SelectItem>
                </SelectSection>
              </Select>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">رنگ</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="default" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button type="submit" color="primary">
              {createPage.isPending ? "در حال ساخت..." : "ساخت صفحه"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
