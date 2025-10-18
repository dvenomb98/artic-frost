"use client";

import * as React from "react";

import * as rhf from "react-hook-form";
import type * as rhfTypes from "react-hook-form";

type GenericFieldProps = {
  name: string;
  label: React.ReactNode;
  description?: React.ReactNode;
};

export {rhf, rhfTypes, type GenericFieldProps};
