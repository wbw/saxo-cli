export default function users(cmd: any): void {
  cmd.parent.apiUrl = "port/v1/users/me";
}
