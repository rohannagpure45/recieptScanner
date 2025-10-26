import type { ComputationOutput } from '@shared/schemas';

export function DebtsTable({ data }: { data: ComputationOutput }) {
  return (
    <div className="rounded-xl border border-slate-800">
      <table className="min-w-full text-sm text-slate-200">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-2 text-left">Guest</th>
            <th className="px-4 py-2 text-left">Owes (¢)</th>
          </tr>
        </thead>
        <tbody>
          {data.perPerson.map((person: ComputationOutput['perPerson'][number]) => (
            <tr key={person.guestId} className="border-t border-slate-800">
              <td className="px-4 py-2">{person.guestId}</td>
              <td className="px-4 py-2">{person.owedToPayerCents}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
