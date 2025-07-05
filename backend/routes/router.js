import { getDuckDBColumnMetadata } from "../handlers/dynamicFilters.js";
import { handleFileUpload } from "../handlers/fileUploadHandler.js";
import {
  getOverview,
  overviewWithFilters,
} from "../handlers/overviewPgDataHandler.js";

const router = [
  {
    method: "GET",
    path: "/",
    handler: () => {
      return "Hello world";
    },
  },
  {
    method: "POST",
    path: "/upload",
    handler: handleFileUpload,
    options: {
      payload: {
        output: "file", // saves file to tmp and gives path
        parse: true,
        multipart: true, // IMPORTANT!
        allow: "multipart/form-data",
        maxBytes: 104857600, // 100MB
      },
    },
  },
  {
    method: "POST",
    path: "/filters",
    handler: getDuckDBColumnMetadata,
  },
  {
    method: "GET",
    path: "/overview",
    handler: getOverview,
  },
  {
    method: "POST",
    path: "/overview",
    handler: overviewWithFilters,
    options: {
      payload: {
        allow: ["application/json"],
        parse: true,
      },
    },
  },
  {
    method: ["GET", "POST"],
    path: "/{any*}",
    handler: (req, h) => {
      return h.redirect("/");
    },
  },
];

export default router;
