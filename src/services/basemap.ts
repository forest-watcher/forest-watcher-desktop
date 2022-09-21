import { BaseService } from "./baseService";

interface ILinks {
  _self: string;
  quads: string;
  tiles: string;
}

interface IGrid {
  quad_size: number;
  resolution: number;
}

export interface IMosaic {
  _links: ILinks;
  bbox: number[];
  coordinate_system: string;
  datatype: string;
  first_acquired: string;
  grid: IGrid;
  id: string;
  interval: string;
  item_types: string[];
  last_acquired: string;
  level: number;
  name: string;
  product_type: string;
  quad_download: boolean;
}

export class ReportService extends BaseService {
  getPlanetBasemaps() {
    return this.fetchJSON(`/mosaics?api_key=${process.env.REACT_APP_PLANET_API_KEY}&_page_size=1000`);
  }
}

export const basemapService = new ReportService(`https://api.planet.com/basemaps/v1`);
