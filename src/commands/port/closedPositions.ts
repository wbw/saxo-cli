export default function closedPositions(cmd: any): void {
  cmd.parent.apiUrl = "port/v1/closedpositions/me";
}
