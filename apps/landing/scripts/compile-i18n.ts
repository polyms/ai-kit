import { compile } from '@inlang/paraglide-js'
import { paraglideCompilerOptions } from '../project.inlang/paraglide.options'

await compile(paraglideCompilerOptions)

console.log('✔ Paraglide compiled with app compiler options.')
