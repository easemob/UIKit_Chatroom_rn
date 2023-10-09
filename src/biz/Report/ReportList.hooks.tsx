import * as React from 'react';

import type { ReportListItemProps } from './ReportList.item';

export function useReportListApi() {
  const dataRef = React.useRef<ReportListItemProps[]>([
    { id: 'Unwelcome commercial content or spam', checked: true },
    { id: 'Pornographic or explicit content', checked: false },
    { id: 'Child abuse', checked: false },
    { id: 'Hate speech or graphic violence', checked: false },
    { id: 'Promote terrorism', checked: false },
    { id: 'Harassment or bullying', checked: false },
  ]);
  const [data, setData] = React.useState<ReportListItemProps[]>(
    dataRef.current
  );

  const _onUpdate = (item: ReportListItemProps) => {
    for (const data of dataRef.current) {
      if (data.id === item.id) {
        data.checked = item.checked;
        break;
      }
    }
    setData([...dataRef.current]);
  };

  const _report = () => {
    // todo:
  };

  return {
    data: data,
    onUpdate: _onUpdate,
    report: _report,
  };
}
