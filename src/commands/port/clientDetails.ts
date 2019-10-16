export default function clientDetails(cmd: any): void {
  cmd.parent.apiUrl = "port/v1/clients/me";
}
