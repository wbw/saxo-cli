export default function balances(cmd: any): void {
  cmd.parent.apiUrl = "port/v1/balances/me";
}
