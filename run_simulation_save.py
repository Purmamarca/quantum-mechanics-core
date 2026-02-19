import matplotlib
matplotlib.use('Agg')
import argparse
import importlib.util
import pathlib
import matplotlib.pyplot as plt

p = pathlib.Path('quantum_lab.py').resolve()
spec = importlib.util.spec_from_file_location('quantum_lab', str(p))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

parser = argparse.ArgumentParser(description='Run simulation from quantum_lab.py and save PNG')
parser.add_argument('--sim', choices=['1','2','3','double_slit','particle_box','bloch_sphere'], default='1',
                    help='Which simulation to run: 1/double_slit, 2/particle_box, 3/bloch_sphere')
parser.add_argument('--out', help='Output filename (overrides default)')
args = parser.parse_args()

mapping = {
    '1': ('double_slit', 'double_slit.png'),
    'double_slit': ('double_slit', 'double_slit.png'),
    '2': ('particle_box', 'particle_box.png'),
    'particle_box': ('particle_box', 'particle_box.png'),
    '3': ('bloch_sphere', 'bloch_sphere.png'),
    'bloch_sphere': ('bloch_sphere', 'bloch_sphere.png'),
}
func_name, default_fname = mapping[args.sim]
out_fname = args.out if args.out else default_fname

orig_show = plt.show

def save_and_close():
    try:
        plt.savefig(out_fname, dpi=150, bbox_inches='tight')
    finally:
        plt.close()

plt.show = save_and_close
try:
    func = getattr(mod, func_name, None)
    if func is None:
        raise RuntimeError(f'Function {func_name} not found in quantum_lab.py')
    func()
    print(f'Saved {out_fname}')
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    plt.show = orig_show
