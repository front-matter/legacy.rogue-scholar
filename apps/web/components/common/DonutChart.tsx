import { useEffect, useState } from 'react';
import { VegaLite } from 'react-vega';
import { VisualizationSpec } from 'vega-embed';
import useWindowDimensions from '@/utils/useWindowDimensions';

type ChartRecord = {
  title: string;
  count: number;
};

type Props = {
  data: ChartRecord[];
  count: number;
  legend?: any;
  title: string;
  range: string[];
  domain: string[];
};

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false,
};

const DonutChart: React.FunctionComponent<Props> = ({ data, count, legend, title, range, domain }) => {
  if (data.length == 0) {
    return <div>No data</div>;
  }
  // get current screen size
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const windowDimensions: any = useWindowDimensions();
  const windowWidth = windowDimensions.width;
  let width = windowWidth >= 1200 ? 200 : 175;
  let height = windowWidth >= 1200 ? 200 : 175;
  let paddingLeft = windowWidth >= 1200 ? 70 : 60;

  let innerRadius = windowWidth >= 1400 ? 98 : 68;
  let outerRadius = windowWidth >= 1400 ? 120 : 90;

  if (windowWidth < 768) {
    innerRadius = 44;
    outerRadius = 60;
    paddingLeft = 0;
    width = 125;
    height = 125;
  }

  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'A simple donut chart with embedded data.',
    padding: { left: paddingLeft, top: 10, right: 10, bottom: 10 },
    width: width,
    height: height,
    data: {
      name: 'table',
    },
    layer: [
      {
        mark: {
          type: 'arc',
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          cursor: 'pointer',
          tooltip: true,
        },
        encoding: {
          theta: {
            field: 'count',
            type: 'quantitative',
          },
          color: {
            field: 'title',
            type: 'nominal',
            title: 'type',
            legend: legend,
            scale: {
              range: range,
              domain: domain,
            },
          },
          order: { field: 'count', type: 'quantitative', sort: 'descending' },
        },
      },
      {
        mark: {
          type: 'text',
          fill: '#767676',
          align: 'center',
          baseline: 'middle',
          fontSize: 27,
        },
        encoding: {
          text: { value: count.toString() },
        },
      },
    ],
    view: {
      stroke: null,
    },
  };

  return (
    <div className="">
      <div className="text-center">
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
        </div>
        <VegaLite renderer="svg" spec={spec} data={{ table: data }} actions={actions} />
      </div>
    </div>
  );
};

export default DonutChart;
