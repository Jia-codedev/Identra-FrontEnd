import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useBuildingMutations from "../hooks/useBuildingMutations";
import { Building } from "@/services/device-and-infra/buildingsApi";

interface BuildingFormProps {
  building?: Building | null;
  onClose: () => void;
}

interface FormData {
  building_name: string;
  building_code: string;
  building_address: string;
  building_description: string;
  building_type: "office" | "warehouse" | "factory" | "residential" | "mixed";
  total_floors: number | "";
  total_area: number | "";
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  city: string;
  country: string;
  postal_code: string;
  building_status: boolean;
}

interface FormErrors {
  building_name?: string;
  building_code?: string;
  building_address?: string;
  building_type?: string;
  total_floors?: string;
  contact_email?: string;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ building, onClose }) => {
  const { t } = useTranslations();
  const { createBuilding, updateBuilding } = useBuildingMutations();

  const [formData, setFormData] = useState<FormData>({
    building_name: "",
    building_code: "",
    building_address: "",
    building_description: "",
    building_type: "office",
    total_floors: "",
    total_area: "",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
    city: "",
    country: "",
    postal_code: "",
    building_status: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  useEffect(() => {
    if (building) {
      setFormData({
        building_name: building.building_name,
        building_code: building.building_code,
        building_address: building.building_address,
        building_description: building.building_description || "",
        building_type: building.building_type,
        total_floors: building.total_floors || "",
        total_area: building.total_area || "",
        contact_person: building.contact_person || "",
        contact_phone: building.contact_phone || "",
        contact_email: building.contact_email || "",
        city: building.city || "",
        country: building.country || "",
        postal_code: building.postal_code || "",
        building_status: building.building_status,
      });
    } else {
      setFormData({
        building_name: "",
        building_code: "",
        building_address: "",
        building_description: "",
        building_type: "office",
        total_floors: "",
        total_area: "",
        contact_person: "",
        contact_phone: "",
        contact_email: "",
        city: "",
        country: "",
        postal_code: "",
        building_status: true,
      });
    }
  }, [building]);

  const handleChange = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.building_name.trim()) {
      newErrors.building_name = t("validation.required");
    }

    if (!formData.building_code.trim()) {
      newErrors.building_code = t("validation.required");
    }

    if (!formData.building_address.trim()) {
      newErrors.building_address = t("validation.required");
    }

    if (!formData.building_type) {
      newErrors.building_type = t("validation.required");
    }

    if (!formData.total_floors || formData.total_floors <= 0) {
      newErrors.total_floors = t("validation.required");
    }

    if (
      formData.contact_email &&
      !/\S+@\S+\.\S+/.test(formData.contact_email)
    ) {
      newErrors.contact_email = t("validation.email");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      building_name: formData.building_name,
      building_code: formData.building_code,
      building_address: formData.building_address,
      building_description: formData.building_description,
      building_type: formData.building_type,
      total_floors: Number(formData.total_floors),
      total_area: formData.total_area ? Number(formData.total_area) : undefined,
      contact_person: formData.contact_person || undefined,
      contact_phone: formData.contact_phone || undefined,
      contact_email: formData.contact_email || undefined,
      city: formData.city || undefined,
      country: formData.country || undefined,
      postal_code: formData.postal_code || undefined,
      building_status: formData.building_status,
    };

    if (building) {
      updateBuilding.mutate(
        { id: building.id, data: submitData },
        {
          onSuccess: () => {
            setFormData({
              building_name: "",
              building_code: "",
              building_address: "",
              building_description: "",
              building_type: "office",
              total_floors: "",
              total_area: "",
              contact_person: "",
              contact_phone: "",
              contact_email: "",
              city: "",
              country: "",
              postal_code: "",
              building_status: true,
            });
            onClose();
          },
        }
      );
      setFormData({
        building_name: "",
        building_code: "",
        building_address: "",
        building_description: "",
        building_type: "office",
        total_floors: "",
        total_area: "",
        contact_person: "",
        contact_phone: "",
        contact_email: "",
        city: "",
        country: "",
        postal_code: "",
        building_status: true,
      });
    } else {
      createBuilding.mutate(submitData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {building ? t("buildings.editBuilding") : t("buildings.addBuilding")}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="building_name" className="text-sm font-medium">
              {t("buildings.buildingName")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="building_name"
              value={formData.building_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("building_name", e.target.value)
              }
              placeholder={t("buildings.enterBuildingName")}
              className={errors.building_name ? "border-destructive" : ""}
            />
            {errors.building_name && (
              <p className="text-sm text-destructive">{errors.building_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="building_code" className="text-sm font-medium">
              {t("buildings.buildingCode")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="building_code"
              value={formData.building_code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("building_code", e.target.value)
              }
              placeholder={t("buildings.enterBuildingCode")}
              className={errors.building_code ? "border-destructive" : ""}
            />
            {errors.building_code && (
              <p className="text-sm text-destructive">{errors.building_code}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="building_address" className="text-sm font-medium">
            {t("buildings.address")} <span className="text-destructive">*</span>
          </label>
          <Input
            id="building_address"
            value={formData.building_address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("building_address", e.target.value)
            }
            placeholder={t("buildings.enterAddress")}
            className={errors.building_address ? "border-destructive" : ""}
          />
          {errors.building_address && (
            <p className="text-sm text-destructive">
              {errors.building_address}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="building_description" className="text-sm font-medium">
            {t("buildings.description")}
          </label>
          <Input
            id="building_description"
            value={formData.building_description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("building_description", e.target.value)
            }
            placeholder={t("buildings.enterDescription")}
          />
        </div>

        {/* Building Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="building_type" className="text-sm font-medium">
              {t("buildings.type")} <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.building_type}
              onValueChange={(value) => handleChange("building_type", value)}
            >
              <SelectTrigger
                className={errors.building_type ? "border-destructive" : ""}
              >
                <SelectValue placeholder={t("buildings.selectBuildingType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">
                  {t("buildings.types.office")}
                </SelectItem>
                <SelectItem value="warehouse">
                  {t("buildings.types.warehouse")}
                </SelectItem>
                <SelectItem value="factory">
                  {t("buildings.types.factory")}
                </SelectItem>
                <SelectItem value="residential">
                  {t("buildings.types.residential")}
                </SelectItem>
                <SelectItem value="mixed">
                  {t("buildings.types.mixed")}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.building_type && (
              <p className="text-sm text-destructive">{errors.building_type}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="total_floors" className="text-sm font-medium">
              {t("buildings.floors")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="total_floors"
              type="number"
              min="1"
              value={formData.total_floors || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "total_floors",
                  e.target.value ? parseInt(e.target.value) : ""
                )
              }
              placeholder={t("buildings.enterFloors")}
              className={errors.total_floors ? "border-destructive" : ""}
            />
            {errors.total_floors && (
              <p className="text-sm text-destructive">{errors.total_floors}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="total_area" className="text-sm font-medium">
            {t("buildings.area")}
          </label>
          <Input
            id="total_area"
            type="number"
            min="0"
            value={formData.total_area || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(
                "total_area",
                e.target.value ? parseInt(e.target.value) : ""
              )
            }
            placeholder={t("buildings.enterArea")}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("buildings.contactInformation")}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="contact_person" className="text-sm font-medium">
                {t("buildings.contactPerson")}
              </label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("contact_person", e.target.value)
                }
                placeholder={t("buildings.enterContactPerson")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_phone" className="text-sm font-medium">
                {t("buildings.contactPhone")}
              </label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("contact_phone", e.target.value)
                }
                placeholder={t("buildings.enterContactPhone")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact_email" className="text-sm font-medium">
              {t("buildings.contactEmail")}
            </label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("contact_email", e.target.value)
              }
              placeholder={t("buildings.enterContactEmail")}
              className={errors.contact_email ? "border-destructive" : ""}
            />
            {errors.contact_email && (
              <p className="text-sm text-destructive">{errors.contact_email}</p>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t("buildings.locationInformation")}
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                {t("buildings.city")}
              </label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("city", e.target.value)
                }
                placeholder={t("buildings.enterCity")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                {t("buildings.country")}
              </label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("country", e.target.value)
                }
                placeholder={t("buildings.enterCountry")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="postal_code" className="text-sm font-medium">
                {t("buildings.postalCode")}
              </label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("postal_code", e.target.value)
                }
                placeholder={t("buildings.enterPostalCode")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="building_status" className="text-sm font-medium">
            {t("common.status")}
          </label>
          <Select
            value={formData.building_status.toString()}
            onValueChange={(value) =>
              handleChange("building_status", value === "true")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("common.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{t("common.active")}</SelectItem>
              <SelectItem value="false">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={createBuilding.isPending || updateBuilding.isPending}
          >
            {createBuilding.isPending || updateBuilding.isPending
              ? t("common.saving")
              : building
              ? t("common.update")
              : t("common.create")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default BuildingForm;
