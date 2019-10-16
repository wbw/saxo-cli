export default function exchanges(exchangeId: string, cmd: any): void {
  cmd.parent.apiUrl = "ref/v1/exchanges";
  if (exchangeId) {
    cmd.parent.apiUrl = `${cmd.parent.apiUrl}/${exchangeId}`;
  }
}
