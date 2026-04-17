import { redirect } from "next/navigation";

export default function NovoMotoristaRedirectPage() {
  redirect("/motoristas/cadastrar");
}