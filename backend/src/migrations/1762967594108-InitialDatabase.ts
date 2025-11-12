import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1762967594108 implements MigrationInterface {
    name = 'InitialDatabase1762967594108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`gender\` \`gender\` enum ('male', 'female', 'other') NULL`);
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`birth_date\` \`birth_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`profile_image\` \`profile_image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_88cea2dc9c31951d06437879b40\``);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_id\` \`parent_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`comment\` \`comment\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`product_variants\` CHANGE \`sku\` \`sku\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_810213283200298c7966f518467\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` CHANGE \`product_variant_id\` \`product_variant_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`transaction_id\` \`transaction_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`refunds\` CHANGE \`reason\` \`reason\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`file_url\` \`file_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`due_date\` \`due_date\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_67b8be57fc38bda573d2a8513ec\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_d5bda805951a38147cb93726a77\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`user_id\` \`user_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`shipping_address_id\` \`shipping_address_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`billing_address_id\` \`billing_address_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`shipments\` CHANGE \`tracking_number\` \`tracking_number\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`shipments\` CHANGE \`carrier\` \`carrier\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`shipments\` CHANGE \`shipped_at\` \`shipped_at\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`reports\` DROP FOREIGN KEY \`FK_a45d00439ac974e58df515497b0\``);
        await queryRunner.query(`ALTER TABLE \`reports\` CHANGE \`generated_by_user_id\` \`generated_by_user_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`reports\` CHANGE \`file_url\` \`file_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_70c2c3d40d9f661ac502de51349\``);
        await queryRunner.query(`ALTER TABLE \`logs\` CHANGE \`user_id\` \`user_id\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`coupons\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`coupons\` CHANGE \`start_date\` \`start_date\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_88cea2dc9c31951d06437879b40\` FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_810213283200298c7966f518467\` FOREIGN KEY (\`product_variant_id\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_67b8be57fc38bda573d2a8513ec\` FOREIGN KEY (\`shipping_address_id\`) REFERENCES \`address\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_d5bda805951a38147cb93726a77\` FOREIGN KEY (\`billing_address_id\`) REFERENCES \`address\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD CONSTRAINT \`FK_a45d00439ac974e58df515497b0\` FOREIGN KEY (\`generated_by_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD CONSTRAINT \`FK_70c2c3d40d9f661ac502de51349\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_70c2c3d40d9f661ac502de51349\``);
        await queryRunner.query(`ALTER TABLE \`reports\` DROP FOREIGN KEY \`FK_a45d00439ac974e58df515497b0\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_d5bda805951a38147cb93726a77\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_67b8be57fc38bda573d2a8513ec\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_810213283200298c7966f518467\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_88cea2dc9c31951d06437879b40\``);
        await queryRunner.query(`ALTER TABLE \`coupons\` CHANGE \`start_date\` \`start_date\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`coupons\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`logs\` CHANGE \`user_id\` \`user_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD CONSTRAINT \`FK_70c2c3d40d9f661ac502de51349\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reports\` CHANGE \`file_url\` \`file_url\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`reports\` CHANGE \`generated_by_user_id\` \`generated_by_user_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD CONSTRAINT \`FK_a45d00439ac974e58df515497b0\` FOREIGN KEY (\`generated_by_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shipments\` CHANGE \`shipped_at\` \`shipped_at\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`shipments\` CHANGE \`carrier\` \`carrier\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`shipments\` CHANGE \`tracking_number\` \`tracking_number\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`billing_address_id\` \`billing_address_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`shipping_address_id\` \`shipping_address_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`user_id\` \`user_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_d5bda805951a38147cb93726a77\` FOREIGN KEY (\`billing_address_id\`) REFERENCES \`address\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_67b8be57fc38bda573d2a8513ec\` FOREIGN KEY (\`shipping_address_id\`) REFERENCES \`address\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`due_date\` \`due_date\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`file_url\` \`file_url\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`refunds\` CHANGE \`reason\` \`reason\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`payments\` CHANGE \`transaction_id\` \`transaction_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_details\` CHANGE \`product_variant_id\` \`product_variant_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_810213283200298c7966f518467\` FOREIGN KEY (\`product_variant_id\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_variants\` CHANGE \`sku\` \`sku\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`comment\` \`comment\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_id\` \`parent_id\` bigint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_88cea2dc9c31951d06437879b40\` FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`profile_image\` \`profile_image\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`birth_date\` \`birth_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`gender\` \`gender\` enum ('male', 'female', 'other') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`info_personal\` CHANGE \`phone\` \`phone\` varchar(20) NULL DEFAULT 'NULL'`);
    }

}
