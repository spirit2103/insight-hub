import axios from "axios";
import { getAuth } from "firebase/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper to get authenticated Axios instance
const getAuthenticatedClient = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const token = await user.getIdToken();

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const fetchDocuments = async () => {
  const client = await getAuthenticatedClient();
  const response = await client.get("/documents/list");
  const nowSeconds = Math.floor(Date.now() / 1000);
  const data = response.data || [];

  if (data.length > 0 && typeof data[0] === "string") {
    const filenames: string[] = data;
    return filenames.map((name) => ({
      id: name,
      fileName: name,
      status: "uploaded",
      uploadDate: { _seconds: nowSeconds, _nanoseconds: 0 },
    }));
  }

  return data.map((item: {
    filename: string;
    original_filename?: string;
    status?: string;
    created_at?: string;
    size_bytes?: number;
    page_count?: number;
    chunk_count?: number;
    company_names?: string[];
    doc_year?: number;
    owner_id?: string;
  }) => {
    const createdAt = item.created_at ? new Date(item.created_at).getTime() / 1000 : nowSeconds;
    return {
      id: item.filename,
      fileName: item.original_filename || item.filename,
      status: item.status || "uploaded",
      uploadDate: { _seconds: Math.floor(createdAt), _nanoseconds: 0 },
      sizeBytes: item.size_bytes ?? null,
      pageCount: item.page_count ?? null,
      chunkCount: item.chunk_count ?? null,
      companyNames: item.company_names ?? [],
      docYear: item.doc_year ?? null,
      ownerId: item.owner_id ?? null,
    };
  });
};

export const fetchMetadata = async () => {
  const client = await getAuthenticatedClient();
  const response = await client.get("/metadata/list/all");
  const items: Array<{
    created_at?: string;
    doc_year?: number | null;
    company_names?: string[];
  }> = response.data || [];

  let mostRecentUpload: string | null = null;
  const years: number[] = [];
  const companySet = new Set<string>();

  items.forEach((item) => {
    if (item.created_at) {
      if (!mostRecentUpload || item.created_at > mostRecentUpload) {
        mostRecentUpload = item.created_at;
      }
    }
    if (typeof item.doc_year === "number") {
      years.push(item.doc_year);
    }
    if (Array.isArray(item.company_names)) {
      item.company_names.forEach((c) => companySet.add(c));
    }
  });

  const avgDocumentYear =
    years.length > 0
      ? years.reduce((sum, y) => sum + y, 0) / years.length
      : 0;

  return {
    totalDocuments: items.length,
    companiesMentioned: companySet.size,
    avgDocumentYear,
    mostRecentUpload,
  };
};

export const fetchChartsData = async () => {
  const client = await getAuthenticatedClient();
  const response = await client.get("/charts");
  return response.data;
};

export const uploadDocument = async (file: File) => {
  const client = await getAuthenticatedClient();
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await client.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchDocumentStatus = async (filename: string) => {
  const client = await getAuthenticatedClient();
  const response = await client.get(`/metadata/${filename}`);
  return response.data as { status?: string };
};

export const askQuestion = async (question: string, documentId: string) => {
  const client = await getAuthenticatedClient();
  const response = await client.post("/qa", {
    question,
    documentId,
  });
  return response.data;
};

export const deleteDocument = async (filename: string) => {
  const client = await getAuthenticatedClient();
  const response = await client.delete(`/documents/${filename}`);
  return response.data;
};

// We will need to replace `documind-insight-hub` with your actual Firebase project ID.
// You can find this in your Firebase Console under Project settings.
// For local development, use the Firebase Emulators: firebase emulators:start
// The default functions emulator URL is http://localhost:5001/{YOUR_PROJECT_ID}/{YOUR_REGION}/{FUNCTION_NAME}
