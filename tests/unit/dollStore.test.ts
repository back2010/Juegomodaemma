import { useDolls, defaultLookFor, selectCurrentLook } from '@/store/dollStore';

const look = () => selectCurrentLook(useDolls.getState());

describe('dollStore', () => {
  beforeEach(() => { localStorage.clear(); useDolls.setState({ selectedDollId: 'sofi', looks: { sofi: defaultLookFor('sofi') } }); });

  it('equipar un slot no toca maquillaje, cabello ni otros slots', () => {
    const s = useDolls.getState();
    s.setMakeup('lips', { styleId: 'lips-classic', color: '#e8263b', colorTag: 'rojo', intensity: 1 });
    s.setHairColor({ mode: 'rainbow' });
    s.equip('earrings', 'earrings-circulo', 'azul');
    s.equip('shoes', 'shoes-flats', 'rojo');
    const l = look();
    expect(l.makeup.lips?.colorTag).toBe('rojo');
    expect(l.hair.color.mode).toBe('rainbow');
    expect(l.outfit.earrings?.variantId).toBe('azul');
    expect(l.outfit.shoes?.variantId).toBe('rojo');
    expect(l.outfit.dress?.itemId).toBe('dress-fiesta');
  });

  it('poner una blusa quita el vestido que la ocultaría', () => {
    useDolls.getState().equip('top', 'top-camiseta', 'rojo');
    expect(look().outfit.dress).toBeUndefined();
    expect(look().outfit.top?.itemId).toBe('top-camiseta');
  });

  it('cada muñeca conserva su propio look', () => {
    useDolls.getState().setHairColor({ mode: 'rainbow' });
    const sofi = look();
    useDolls.getState().restore({ ...useDolls.getState(), selectedDollId: 'sofi' });
    expect(look()).toEqual(sofi);
  });

  it('stickers: agregar, mover y quitar', () => {
    const s = useDolls.getState();
    s.addSticker({ uid: 'x', stickerId: 'st-corazon-rosa', x: 1, y: 2, scale: 1, rot: 0, zone: 'free' });
    s.updateSticker('x', { x: 50 });
    expect(look().stickers[0].x).toBe(50);
    s.removeSticker('x');
    expect(look().stickers).toHaveLength(0);
  });
});
