import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

// Declare allowed roles manually
const allowedRoles = ["CUSTOMER", "SELLER", "ADMIN"] as const;
type RoleType = (typeof allowedRoles)[number];

// ---------------- REGISTER USER ----------------
 const registerUser = async ({
  name,
  email,
  password,
  role,
  image,
}: {
  name: string;
  email: string;
  password: string;
  role?: string;
  image?: string | null;
}) => {
  const result = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  if (!result.token) {
    return { error: "User already exists", user: result.user };
  }


  const userRole: RoleType = allowedRoles.includes(role as RoleType)
    ? (role as RoleType)
    : "CUSTOMER";

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: userRole, image: image || null },
  });

  const user = await prisma.user.findUnique({ where: { id: result.user.id } });

  return { token: result.token, user };
};

// ---------------- LOGIN USER ----------------
 const loginUser = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({ body: { email, password } });

  if (!result.token) {
    return { error: "Invalid credentials" };
  }

  return { token: result.token, user: result.user };
};

// ---------------- GET CURRENT USER ----------------
 const getCurrentUser = async (token: string) => {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return { error: "Invalid token" };

  return { user: session.user };
};
export const authService = {
    registerUser,   
    loginUser,   
    getCurrentUser
}
