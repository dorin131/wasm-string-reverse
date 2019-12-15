const iw = require('inline-webassembly');

const reverse = async (originalString) => {
  const code = `;;wasm
    (module
      (memory $0 1)
      (export "memory" (memory $0))
      ;; declaring and exporting a function named "reverse"
      ;; it takes a pointer to a string and returns a 32 bit integer
      ;; which is going to be the pointer to the reversed string
      (func (export "reverse") (param $original_str_ref i32) (result i32)

        (local $original_str_len i32)
  
        ;; declaring new variable to store result pointer
        (local $reversed_str_ref i32)

        ;; declaring iterator variable
        (local $iterator i32)

        ;; write pointer
        (local $write_to i32)

        (;
          ----------------------------------------
          Loop to calculate original string length
          ----------------------------------------
        ;)

        ;; setting iterator to 0, for the following loop
        (set_local $iterator
          (i32.const 0)  
        )

        ;; count the length of the original string and store in $original_str_len
        (block
          (loop
            ;; break loop when reaching a zero byte value
            (br_if 1
              (i32.eq
                (i32.load8_s
                  (i32.add
                    (get_local $iterator)
                    (get_local $original_str_ref)  
                  )  
                )
                (i32.const 0)
              )
            )

            ;; increment iterator by 1
            (set_local $iterator
              (i32.add
                (get_local $iterator)
                (i32.const 1)  
              )  
            )
            
            ;; repeat loop
            (br 0)
          )  
        )
  
        (set_local $original_str_len
          (get_local $iterator)  
        )

        (;
          ---------------------------------------------------------------------
          Setting $reversed_str_ref = $original_str_ref + $original_str_len + 1
          ---------------------------------------------------------------------  
        ;)

        (set_local $reversed_str_ref
          ;; adding 1
          (i32.add
            ;; adding the string pointer with its length
            (i32.add
              (get_local $original_str_ref)
              (get_local $original_str_len)
            )
            (i32.const 1)
          )
        )

        (;
          ----------------------
          Loop to reverse string
          ----------------------
        ;)
        
        ;; setting iterator to 0, for the following loop
        (set_local $iterator
          (i32.const 0)  
        )
  
        ;; we'll start writing to the start of the result
        (set_local $write_to
          (get_local $reversed_str_ref)  
        )
          
        (block
          (loop
            ;; store one character from original string to resulting string
            (i32.store
              (get_local $write_to)
              ;; load 1 byte and sign-extend i8 to i32
              (i32.load8_s
                (i32.sub
                  (i32.sub
                    (i32.add
                      (get_local $original_str_ref)
                      (get_local $original_str_len)
                    )
                    (get_local $iterator)
                  )
                  (i32.const 1)
                )
              )  
            )
  
            ;; increment position to write to on next loop iteration
            (set_local $write_to
              (i32.add
                (get_local $write_to)
                (i32.const 1)  
              )  
            )
  
            ;; increment iterator by 1 for every loop iteration
            (set_local $iterator
              (i32.add
                (get_local $iterator)
                (i32.const 1)  
              )  
            )
            
            ;; break loop if iterator reaches string length
            (br_if 1
              (i32.ge_s
                (get_local $iterator)
                (get_local $original_str_len)
              )
            )
            
            ;; repeat loop
            (br 0)
          )
        )
  
        (;
          --------------------------------------------------------------
          Returning result which contains pointer to the reversed string
          --------------------------------------------------------------  
        ;)
        (get_local $reversed_str_ref)
      )  
    )
  `;
  
  const wasmModule = await iw(code);
  
  const originalStringRef = wasmModule.createString(originalString);
  const reversedStringRef = wasmModule.reverse(originalStringRef);
  return wasmModule.readString(reversedStringRef);
};

module.exports = {
  reverse
};
