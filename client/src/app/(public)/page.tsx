import AdminBannerForm from "@/views/admin/AdminBannerForm";
import { AddString } from "@/views/public/addString/AddString";
import ClickExample from "@/views/public/domMethod/ClickExample";
import { DomMethodsDemo } from "@/views/public/domMethod/DomMethodsDemo";
import { DomRefDemo } from "@/views/public/domMethod/DomRefDemo";
import RefExample from "@/views/public/domMethod/RefExample";
import { KeyboardEvents } from "@/views/public/keyboard/KeyboardEvents";
import { MouseEvents } from "@/views/public/mouse/MouseEvents";
import React, { FC } from "react";

const page: FC = () => {
  return (
    <div className="flex items-center, justify-center">
      <DomMethodsDemo />
      <MouseEvents />
      <KeyboardEvents />
      <ClickExample />
      <RefExample />
      <DomRefDemo />
      <AddString />
      <AdminBannerForm />
    </div>
  );
};

export default page;
