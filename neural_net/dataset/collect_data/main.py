import record_signs
import check_signs
import convert_dataset


def main():
    a_1 = 'collect'
    a_2 = 'check'
    a_3 = 'convert'
    action = input(f'What action do you want to perform? ({a_1}/{a_2}/{a_3}) ')
    if action == a_1:
        record_signs.main()
    elif action == a_2:
        check_signs.main()
    elif action == a_3:
        convert_dataset.main()


if __name__ == '__main__':
    main()
